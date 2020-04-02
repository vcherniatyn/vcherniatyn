export class Response {
    constructor(
        public statusCode: number,
        public content: any,
        public message: string,
    ) { }
}
