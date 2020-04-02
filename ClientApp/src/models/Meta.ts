export class Meta {
    constructor(
        public requiresAuth: boolean = true,
        public authorize: string[],
    ) { }
}
