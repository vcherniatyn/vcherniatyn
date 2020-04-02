export class MenuItem {
    constructor(
        public title: string,
        public icon: string,
        public link: string,
        public isVisible: boolean = false,
        public roles: string[] = [],
    ) { }
}
