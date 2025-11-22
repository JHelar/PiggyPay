import { i18n } from "@lingui/core";
import { messages as enMessages } from "./en/messages";
import { messages as svMessages } from "./sv/messages";

i18n.load({
	en: enMessages,
	sv: svMessages,
});
i18n.activate("en");
