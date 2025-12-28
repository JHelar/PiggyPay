import z from "zod";

// piggysplit://groups/:id/invite
const GroupShareLinkMetaArray = z.tuple([
	z.literal("groups"),
	z.coerce.number(),
	z.literal("invite"),
]);
type GroupShareLinkMetaArray = z.infer<typeof GroupShareLinkMetaArray>;

const PathDelim = "/";
type PathDelim = typeof PathDelim;
type GroupShareLink = `groups${PathDelim}${number}${PathDelim}invite`;
export const GroupShareLink = z
	.string()
	.transform((value) => value.split(`://`).at(1) ?? "")
	.refine(
		(path): path is GroupShareLink =>
			GroupShareLinkMetaArray.safeParse(path.split(PathDelim)).success,
	);

export const groupShareLinkId = GroupShareLink.transform((path) => {
	const [_, groupId] = path.split(PathDelim);
	return Number(groupId);
});
