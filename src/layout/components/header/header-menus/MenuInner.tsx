import { Button, Icon } from "@gems-web/components";
import { HOME_URL } from "@gems-web/utils";

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
