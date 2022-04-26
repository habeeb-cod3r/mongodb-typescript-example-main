// External dependencies

import { ObjectId } from "mongodb";

// Class Implementation

export default class Student {
    constructor(public firstName: string, public lastName: string, public email: string, public _id?: ObjectId) {}
}