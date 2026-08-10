import path from "node:path";

const imageFiles = import.meta.glob<ImageMetadata>(
	[
		"../assets/images/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
		"../assets/anime/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
		"../assets/home/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
		"../assets/music/cover/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
		"../assets/desktop-banner/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
		"../assets/mobile-banner/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
		"../assets/avatar.*",
		"../public/images/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
	],
	{ import: "default" },
);

function normalizeKey(value: string): string {
	return value.replace(/\\/g, "/");
}

export function isRemoteImageSource(src: string): boolean {
	return /^(?:https?:)?\/\//.test(src) || src.startsWith("data:");
}

export function publicImageUrl(src: string): string {
	if (isRemoteImageSource(src)) return src;
	if (!src.startsWith("/")) return src;
	const base = import.meta.env.BASE_URL.replace(/\/$/, "");
	return `${base}${src}` || "/";
}

export async function resolveImageMetadata(
	src: string,
	basePath = "/",
): Promise<ImageMetadata | undefined> {
	if (isRemoteImageSource(src)) return undefined;

	const key = src.startsWith("/")
		? `../assets/public/${src.replace(/^\/+/, "")}`
		: `../${path.posix.join(basePath.replace(/^\/+/, ""), src)}`;
	const loader = imageFiles[normalizeKey(path.posix.normalize(key))];

	if (!loader) return undefined;

	try {
		const meta = await loader();
		return meta;
	} catch (e) {
		console.warn(`[WARN] Could not process image metadata for '${src}': ${e}`);
		return undefined;
	}
}
