// export class ValidationError extends Error {
//   constructor(
//     message: string,
//     public readonly statusCode: number = 400,
//   ) {
//     super(message);
//     this.name = 'ValidationError';
//     this.statusCode = statusCode;
//   }
// }

export interface ValidationIssue {
  field: string;
  message: string;
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
    public readonly details?: ValidationIssue[],
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
