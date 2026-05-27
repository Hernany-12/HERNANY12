export interface Term {
  id: string;
  name: string;
}

export interface Engineer {
  id: string;
  name: string;
  values: Record<string, string>; // termId -> value
  createdAt: string;
  updatedAt: string;
}
