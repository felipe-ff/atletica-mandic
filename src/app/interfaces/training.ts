export interface Training {
    id?: string,
    name?: string,
    date?: number,
    description?: string,
    category?: string,
    cancelled?: boolean,
    attendanceList?: string[],
    attendanceListDetailed?: any[]
}