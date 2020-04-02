export class User {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public password: string,
        public lastLoginDate?: Date,
        public roles: string[] = [] as string[],
        public isActive: boolean = false,
        public token: string = '',

        public showPass: boolean = false,
        public saveLoading: boolean = false,
        public isActiveLoading: boolean = false,
        public removeLoading: boolean = false,
        public isValid: boolean = false,
    ) { }
}
