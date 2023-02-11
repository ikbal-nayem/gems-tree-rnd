import { FC } from "react";

export type IColors =
	| "primary"
	| "secondary"
	| "success"
	| "danger"
	| "warning"
	| "info"
	| "dark"
	| "light"
	| "link";

export type ISizes = "lg" | "md" | "sm";

export interface IMeta {
	page?: number;
	prevOffset?: number;
	nextOffset?: number;
	limit?: number;
	totalRecords?: number;
	resultCount?: number;
	totalPageCount?: number;
}

export interface IAppRoutes {
	link: string;
	element?: FC;
	icon?: string;
	params?: { [key: string]: string | number };
	childrens?: IAppRoutes[];
	redirect?: string;
	isPrivate?: boolean;
}

export interface IFile {
	bucketName: string;
	filePath: string;
	fileName: string;
	fileType: string;
	originalFileName: string;
	previewUrl: string;
}

export interface IMetaKeyResponse {
	id: string;
	titleEn: string;
	titleBn: string;
	metaTypeEn: string;
	metaTypeBn: string;
	metaKey: string;
	isDefault: boolean;
	serial: number;
	isActive: boolean;
}

export interface IRequestPayload {
	meta: {
		page: number;
		limit: number;
		sort?: { [key: string]: any }[];
	};
	body?: { [key: string]: any };
}