import { apiClient } from "../api/api-client";
import type { PeopleRepository } from "../../domain/repositories/interfaces";
import type { Person, CreatePersonRequest, ApiResponse } from "../../domain/entities/person.entity";

export class PeopleRepositoryImpl implements PeopleRepository {
    async findAll(): Promise<Person[]> {
        const response = await apiClient.get<ApiResponse<Person[]>>('/api/people');
        return response.data;
    }

    async create(person: CreatePersonRequest): Promise<Person> {
        const response = await apiClient.post<ApiResponse<Person>>('/api/people', person);
        return response.data;
    }
}

export const peopleRepository = new PeopleRepositoryImpl();
