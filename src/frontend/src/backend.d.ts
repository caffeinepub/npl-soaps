import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactSubmissionAdmin {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface Product {
    id: string;
    name: string;
    category: string;
    benefits: Array<string>;
    price: bigint;
}
export interface backendInterface {
    getAllProducts(): Promise<Array<Product> | null>;
    getContactSubmissionsAdmin(): Promise<Array<ContactSubmissionAdmin>>;
    getProductById(id: string): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    submitContactForm(name: string, email: string, message: string): Promise<boolean>;
}
