export interface IUser {
    email: string;
    first_name: string;
    last_name: string;
    roleName: 'Customer' | 'Event Organizer';
}