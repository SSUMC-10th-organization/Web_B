export interface Lp {
	id: number;
	title: string;
	artist: string;
	coverUrl: string;
	likeCount: number;
	createdAt: string;
}

export const mockLps: Lp[] = [
	{
		id: 1,
		title: "Kind of Blue",
		artist: "Miles Davis",
		coverUrl: "https://picsum.photos/seed/lp1/300/300",
		likeCount: 42,
		createdAt: "1 days ago",
	},
	{
		id: 2,
		title: "Fear of Fours",
		artist: "Lamb",
		coverUrl: "https://picsum.photos/seed/lp2/300/300",
		likeCount: 28,
		createdAt: "2 days ago",
	},
	{
		id: 3,
		title: "Random Album",
		artist: "Artist 3",
		coverUrl: "https://picsum.photos/seed/lp3/300/300",
		likeCount: 15,
		createdAt: "3 days ago",
	},
	{
		id: 4,
		title: "÷ (Divide)",
		artist: "Ed Sheeran",
		coverUrl: "https://picsum.photos/seed/lp4/300/300",
		likeCount: 99,
		createdAt: "4 days ago",
	},
	{
		id: 5,
		title: "Blue",
		artist: "Artist 5",
		coverUrl: "https://picsum.photos/seed/lp5/300/300",
		likeCount: 34,
		createdAt: "5 days ago",
	},
	{
		id: 6,
		title: "Übermensch",
		artist: "Artist 6",
		coverUrl: "https://picsum.photos/seed/lp6/300/300",
		likeCount: 21,
		createdAt: "6 days ago",
	},
	{
		id: 7,
		title: "Portrait",
		artist: "Artist 7",
		coverUrl: "https://picsum.photos/seed/lp7/300/300",
		likeCount: 57,
		createdAt: "7 days ago",
	},
	{
		id: 8,
		title: "X",
		artist: "Ed Sheeran",
		coverUrl: "https://picsum.photos/seed/lp8/300/300",
		likeCount: 88,
		createdAt: "8 days ago",
	},
	{
		id: 9,
		title: "Album 9",
		artist: "Artist 9",
		coverUrl: "https://picsum.photos/seed/lp9/300/300",
		likeCount: 11,
		createdAt: "9 days ago",
	},
	{
		id: 10,
		title: "Album 10",
		artist: "Artist 10",
		coverUrl: "https://picsum.photos/seed/lp10/300/300",
		likeCount: 63,
		createdAt: "10 days ago",
	},
];
