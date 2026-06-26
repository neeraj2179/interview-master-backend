import OpenAI from 'openai';
import { prisma } from '../prisma';

export class AdminService {
  static async handleChatCommand(prompt: string) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    // Fallback Mock Logic if no API key is provided
    if (!apiKey) {
      console.warn("No OPENAI_API_KEY found. Using mock AI response.");
      return this.executeMockCommand(prompt);
    }

    const openai = new OpenAI({ apiKey });

    // We ask OpenAI to return a structured JSON representing what to create.
    const systemPrompt = `
      You are an AI admin assistant for an interview preparation platform. 
      The user will give you a command to add a technology, topic, study guide, and multiple-choice questions.
      You must respond ONLY with a valid JSON object matching this schema, no markdown blocks around it, just raw JSON:
      {
        "technology": { "name": "String", "slug": "String", "description": "String" },
        "topic": { "name": "String", "slug": "String", "content": "String (Markdown guide)" },
        "questions": [
          {
            "text": "String",
            "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
            "explanation": "String",
            "options": [
              { "text": "String", "isCorrect": Boolean }
            ]
          }
        ]
      }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message.content || '{}';
      
      // Clean markdown JSON block if AI sends it
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      let parsedData;
      try {
        parsedData = JSON.parse(cleanedText);
      } catch (err) {
        throw new Error("AI returned invalid JSON format.");
      }

      return await this.saveToDatabase(parsedData);
    } catch (error: any) {
      console.error("AI Error:", error);
      throw new Error("Failed to process AI command: " + error.message);
    }
  }

  private static async saveToDatabase(data: any) {
    // 1. Ensure Technology exists
    let tech = await prisma.technology.findUnique({ where: { slug: data.technology.slug } });
    if (!tech) {
      tech = await prisma.technology.create({
        data: {
          name: data.technology.name,
          slug: data.technology.slug,
          description: data.technology.description,
          isActive: true
        }
      });
    }

    // 2. Ensure Topic exists and update content
    let topic = await prisma.topic.findUnique({
      where: {
        technologyId_slug: { technologyId: tech.id, slug: data.topic.slug }
      }
    });

    if (!topic) {
      topic = await prisma.topic.create({
        data: {
          name: data.topic.name,
          slug: data.topic.slug,
          content: data.topic.content,
          technologyId: tech.id,
          isActive: true
        }
      });
    } else {
      topic = await prisma.topic.update({
        where: { id: topic.id },
        data: { content: data.topic.content }
      });
    }

    // 3. Create Questions
    let questionsAdded = 0;
    if (data.questions && Array.isArray(data.questions)) {
      for (const q of data.questions) {
        await prisma.question.create({
          data: {
            text: q.text,
            difficulty: q.difficulty || 'BEGINNER',
            explanation: q.explanation,
            technologyId: tech.id,
            topicId: topic.id,
            options: {
              create: q.options.map((opt: any, index: number) => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                sortOrder: index
              }))
            }
          }
        });
        questionsAdded++;
      }
    }

    return {
      message: `Successfully processed command! Added/Updated Technology: ${tech.name}, Topic: ${topic.name}, and inserted ${questionsAdded} questions.`,
      technology: tech.name,
      topic: topic.name,
      questionsAdded
    };
  }

  private static async executeMockCommand(prompt: string) {
    // Simulate a 2-second AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock payload to save
    const mockData = {
      technology: { name: "Docker", slug: "docker", description: "Containerization platform" },
      topic: { 
        name: "Containers vs VMs", 
        slug: "containers-vs-vms", 
        content: "# Containers vs VMs\n\nContainers are lightweight, standalone, executable packages of software that include everything needed to run an application. Virtual Machines (VMs) are heavy, requiring a full guest operating system.\n\n### Key Differences\n- **Size**: Containers are MBs, VMs are GBs.\n- **Speed**: Containers start in milliseconds, VMs take minutes."
      },
      questions: [
        {
          text: "Which of the following is true about containers?",
          difficulty: "BEGINNER",
          explanation: "Containers share the host OS kernel, making them lightweight.",
          options: [
            { text: "They require a full guest OS", isCorrect: false },
            { text: "They share the host OS kernel", isCorrect: true },
            { text: "They are slower to start than VMs", isCorrect: false },
            { text: "They run on a hypervisor directly", isCorrect: false }
          ]
        }
      ]
    };

    return await this.saveToDatabase(mockData);
  }

  // --- Technologies CRUD ---
  
  static async getTechnologies() {
    return prisma.technology.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { topics: true, questions: true, tests: true },
        },
      },
    });
  }

  static async createTechnology(data: any) {
    // Basic validation
    if (!data.name || !data.slug) {
      throw { status: 400, message: 'Name and slug are required' };
    }
    
    // Check if exists
    const exists = await prisma.technology.findUnique({ where: { slug: data.slug } });
    if (exists) {
      throw { status: 400, message: 'Technology with this slug already exists' };
    }

    return prisma.technology.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: data.sortOrder || 0
      }
    });
  }

  static async updateTechnology(id: string, data: any) {
    const tech = await prisma.technology.findUnique({ where: { id } });
    if (!tech) throw { status: 404, message: 'Technology not found' };

    return prisma.technology.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        isActive: data.isActive,
        sortOrder: data.sortOrder
      }
    });
  }

  static async deleteTechnology(id: string) {
    const tech = await prisma.technology.findUnique({ where: { id } });
    if (!tech) throw { status: 404, message: 'Technology not found' };

    await prisma.technology.delete({ where: { id } });
    return true;
  }

  // --- Topics CRUD ---
  
  static async getTopics() {
    return prisma.topic.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        technology: { select: { id: true, name: true, color: true, icon: true } },
        _count: { select: { questions: true, tests: true } }
      }
    });
  }

  static async createTopic(data: any) {
    if (!data.name || !data.slug || !data.technologyId) {
      throw { status: 400, message: 'Name, slug, and technology are required' };
    }

    const exists = await prisma.topic.findUnique({
      where: { technologyId_slug: { technologyId: data.technologyId, slug: data.slug } }
    });
    if (exists) {
      throw { status: 400, message: 'Topic with this slug already exists for this technology' };
    }

    return prisma.topic.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        content: data.content,
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: data.sortOrder || 0,
        technologyId: data.technologyId
      },
      include: {
        technology: { select: { id: true, name: true } }
      }
    });
  }

  static async updateTopic(id: string, data: any) {
    const topic = await prisma.topic.findUnique({ where: { id } });
    if (!topic) throw { status: 404, message: 'Topic not found' };

    return prisma.topic.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        content: data.content,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        technologyId: data.technologyId
      },
      include: {
        technology: { select: { id: true, name: true } }
      }
    });
  }

  static async deleteTopic(id: string) {
    const topic = await prisma.topic.findUnique({ where: { id } });
    if (!topic) throw { status: 404, message: 'Topic not found' };

    await prisma.topic.delete({ where: { id } });
    return true;
  }

  // --- Tests CRUD ---
  
  static async getTests() {
    return prisma.test.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        technology: { select: { name: true } },
        topic: { select: { name: true } },
        _count: { select: { testQuestions: true, attempts: true } }
      }
    });
  }

  static async createTest(data: any) {
    if (!data.title || !data.technologyId) throw { status: 400, message: 'Title and technology are required' };
    return prisma.test.create({
      data: {
        title: data.title,
        description: data.description,
        technologyId: data.technologyId,
        topicId: data.topicId || null,
        durationMinutes: parseInt(data.durationMinutes) || 30,
        totalQuestions: parseInt(data.totalQuestions) || 10,
        passingScore: parseInt(data.passingScore) || 60,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });
  }

  static async updateTest(id: string, data: any) {
    return prisma.test.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        technologyId: data.technologyId,
        topicId: data.topicId || null,
        durationMinutes: data.durationMinutes ? parseInt(data.durationMinutes) : undefined,
        totalQuestions: data.totalQuestions ? parseInt(data.totalQuestions) : undefined,
        passingScore: data.passingScore ? parseInt(data.passingScore) : undefined,
        isActive: data.isActive
      }
    });
  }

  static async deleteTest(id: string) {
    await prisma.test.delete({ where: { id } });
    return true;
  }

  // --- Questions CRUD ---
  
  static async getQuestions() {
    return prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        technology: { select: { name: true } },
        topic: { select: { name: true } },
        options: true
      }
    });
  }

  static async createQuestion(data: any) {
    if (!data.text || !data.technologyId || !data.options || data.options.length === 0) {
      throw { status: 400, message: 'Text, technology, and options are required' };
    }
    
    return prisma.question.create({
      data: {
        text: data.text,
        type: data.type || 'SINGLE_CORRECT',
        difficulty: data.difficulty || 'BEGINNER',
        explanation: data.explanation,
        technologyId: data.technologyId,
        topicId: data.topicId || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        options: {
          create: data.options.map((opt: any, index: number) => ({
            text: opt.text,
            isCorrect: opt.isCorrect === true || opt.isCorrect === 'true',
            sortOrder: index
          }))
        }
      },
      include: { options: true }
    });
  }

  static async updateQuestion(id: string, data: any) {
    const updateData: any = {
      text: data.text,
      type: data.type,
      difficulty: data.difficulty,
      explanation: data.explanation,
      technologyId: data.technologyId,
      topicId: data.topicId || null,
      isActive: data.isActive
    };

    if (data.options && data.options.length > 0) {
      await prisma.questionOption.deleteMany({ where: { questionId: id } });
      updateData.options = {
        create: data.options.map((opt: any, index: number) => ({
          text: opt.text,
          isCorrect: opt.isCorrect === true || opt.isCorrect === 'true',
          sortOrder: index
        }))
      };
    }

    return prisma.question.update({
      where: { id },
      data: updateData,
      include: { options: true }
    });
  }

  static async deleteQuestion(id: string) {
    await prisma.question.delete({ where: { id } });
    return true;
  }

  // --- Users CRUD ---
  
  static async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        role: { select: { name: true } },
        _count: { select: { attempts: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async toggleUserStatus(id: string, isActive: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, name: true, isActive: true }
    });
  }
}
