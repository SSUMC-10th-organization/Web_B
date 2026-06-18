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

export type Genre = {
	id: number;
	name: string;
};

export type ProductionCompany = {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
};

export type MovieDetail = {
	id: number;
	title: string;
	overview: string;
	poster_path: string;
	backdrop_path: string;
	release_date: string;
	runtime: number;
	vote_average: number;
	vote_count: number;
	tagline: string;
	status: string;
	budget: number;
	revenue: number;
	genres: Genre[];
	production_companies: ProductionCompany[];
	origin_country: string[];
	original_title: string;
};
