export class Task {
  constructor(public id: number, public name: string, public description: string) {}
  public created_by: string;
  public created_at: string;
  public updated_at: string;
  public status: number;
}