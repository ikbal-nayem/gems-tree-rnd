import { Button, Icon } from "@gems/components";
import { HOME_URL } from "@gems/utils";

export function MenuInner() {
	return (
		<div className="align-self-center">
			<a href={HOME_URL}>
				<Button color="primary" variant="light">
					<Icon icon="home" />
					&nbsp;হোম
				</Button>
			</a>
		</div>
	);
}
