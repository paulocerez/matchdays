/**
 * Handles database operations with uniform error handling
 * @param operation Function performing a database operation
 * @param errorMessage Error message to be thrown in error cases
 * @returns Resulting return values of database operation
 * @throws Error thrown with custom message if operation fails
 */

export default async function handleDatabaseOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}
