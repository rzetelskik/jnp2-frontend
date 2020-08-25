import { Task } from './task'

export class List {
  constructor(public id: number, public name: string, public tasks: Task[]) {}
}