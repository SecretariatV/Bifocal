import { exec, ExecException } from 'child_process';

interface MessageResult {
  date: string;
  text: string;
  is_from_me: number;
}

export const executeQuery = async (query: string): Promise<MessageResult[]> => {
  try {
    // Escape the query for shell execution
    const escapedQuery = query.replace(/"/g, '\\"');
    const command = `sqlite3 -json ~/Library/Messages/chat.db "${escapedQuery}"`;

    const result = await new Promise<string>((resolve, reject) => {
      exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
          return;
        }
        if (stderr) {
          console.error('Stderr:', stderr);
          reject(new Error(stderr));
          return;
        }
        resolve(stdout);
      });
    });

    // Parse the JSON result
    const messages: MessageResult[] = JSON.parse(result);
    return messages;
  } catch (error) {
    console.error('Error executing query:', error);
    return [];
  }
} 