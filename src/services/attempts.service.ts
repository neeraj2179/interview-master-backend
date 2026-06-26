import { prisma } from '../prisma';

export class AttemptsService {
  static async submit(userId: string, data: any) {
    const { testId, answers } = data;

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: { _count: { select: { testQuestions: true } } },
    });
    if (!test) throw { status: 404, message: 'Test not found' };

    const answeredQuestionIds = answers.map((a: any) => a.questionId);
    
    // Fetch questions to calculate score
    const questions = await prisma.question.findMany({
      where: { id: { in: answeredQuestionIds } },
      include: { options: true },
    });

    let score = 0;
    const attemptAnswers = answers.map((answer: any) => {
      const q = questions.find(q => q.id === answer.questionId);
      const selectedOption = q?.options.find(o => o.id === answer.selectedOptionId);
      const isCorrect = selectedOption?.isCorrect || false;
      if (isCorrect) score++;
      return {
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        isCorrect,
      };
    });

    const timeTaken = data.timeSpentSeconds || 0;
    const totalMarks = test.totalQuestions;
    const passingScore = test.passingScore;
    const isPassed = (score / Math.max(totalMarks, 1)) * 100 >= passingScore;

    // Create the attempt
    const attempt = await prisma.attempt.create({
      data: {
        userId,
        testId,
        score,
        totalMarks,
        isPassed,
        timeTaken,
        completedAt: new Date(),
        attemptAnswers: { create: attemptAnswers },
      },
      include: { attemptAnswers: true },
    });

    // Update user progress
    await this.updateProgress(userId, test.technologyId);

    return attempt;
  }

  static async getMyAttempts(userId: string) {
    return prisma.attempt.findMany({
      where: { userId },
      include: {
        test: { select: { title: true, technology: { select: { name: true } }, topic: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(userId: string, id: string) {
    const attempt = await prisma.attempt.findFirst({
      where: { id, userId },
      include: {
        test: { include: { technology: true, topic: true } },
        attemptAnswers: {
          include: {
            question: { include: { options: true } },
          },
        },
      },
    });
    if (!attempt) throw { status: 404, message: 'Attempt not found' };
    
    // Format to match old structure if needed
    const { attemptAnswers, test, ...rest } = attempt;
    return {
      ...rest,
      test,
      technology: test.technology,
      topic: test.topic,
      answers: attemptAnswers,
    };
  }

  private static async updateProgress(userId: string, technologyId: string) {
    // Calculate total attempts for this technology across all tests
    const attempts = await prisma.attempt.findMany({
      where: { 
        userId, 
        test: { technologyId } 
      },
      include: { test: true }
    });

    const totalAttempted = attempts.length;
    const testsPassed = attempts.filter(a => a.isPassed).length;
    
    // Unique tests attempted
    const uniqueTestIds = new Set(attempts.map(a => a.testId));
    const totalTests = uniqueTestIds.size;

    let totalCorrect = 0;
    attempts.forEach(a => totalCorrect += a.score);

    await prisma.userProgress.upsert({
      where: { userId_technologyId: { userId, technologyId } },
      update: { totalAttempted, totalTests, testsPassed, totalCorrect, lastActivityAt: new Date() },
      create: { userId, technologyId, totalAttempted, totalTests, testsPassed, totalCorrect },
    });
  }
}
