export type MovieDetail = {
	id: number;
	title: string;
	original_title: string;
	genres: { id: number; name: string }[];
	adult: boolean;
	backdrop_path: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: { id: number; name: string; logo_path: string }[];
	release_date: string;
	runtime: number;
	status: string;
	tagline: string;
	vote_average: number;
	vote_count: number;
};

export type CrewMember = {
	id: number;
	name: string;
	job: string;
	department: string;
	profile_path: string | null;
};

export type Credits = {
	cast: {
		id: number;
		name: string;
		character: string;
		profile_path: string | null;
		order: number;
	}[];
	crew: CrewMember[];
};
