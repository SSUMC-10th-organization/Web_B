export type Movie = {
	id: number;
	title: string;
	overview: string;
	poster_path: string;
	release_date: string;
	vote_average: number;
	// 필요하다면 추가 필드도 정의 가능
};

export type MovieResponse = {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
};

export type Cast = {
	id: number;
	name: string;
	character: string;
	profile_path: string | null;
	order: number;
};

export type Crew = {
	id: number;
	name: string;
	job: string;
	department: string;
};

export type Credits = {
	id: number;
	cast: Cast[];
	crew: Crew[];
};
