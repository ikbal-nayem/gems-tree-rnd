import { MenuComponent } from "assets/ts/components";

const reInitMenu = () => {
	setTimeout(() => {
		MenuComponent.reinitialization();
	}, 500);
};

export { reInitMenu };
