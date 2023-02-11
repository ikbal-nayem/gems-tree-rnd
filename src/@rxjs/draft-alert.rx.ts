import { CommonService } from "@services/api/Common.service";
import { Dispatch } from "react";
import { Subject } from "rxjs";

export type IDraftAlertState = {
	showDraft: boolean;
	hasDraft: boolean;
	numberOfDraft: number;
};

const initState = {
	showDraft: false,
	hasDraft: false,
	numberOfDraft: 0,
};

let state = { ...initState };

const subject = new Subject();

export const draftAlert$ = {
	check: () =>
		CommonService.checkDraft().then((resp) => {
			state = { ...state, hasDraft: resp?.body };
			subject.next(state);
		}),
	subscribe: (setState: Dispatch<any>) => subject.subscribe(setState),
	show: () => {
		state = { ...state, showDraft: true };
		subject.next(state);
	},
	hide: () => {
		state = { ...state, showDraft: false };
		subject.next(state);
	},
	saveAsDraft: () => {
		state = { ...state, hasDraft: true };
		subject.next(state);
	},
	initState,
};
