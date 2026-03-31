import { config } from '@/theme/_config';
import { Say } from '@/utils';
import { ICatchError } from '@/utils/Say';
import type { ComponentProps } from 'react';
import { Linking, StyleProp, StyleSheet, TextStyle } from 'react-native';
import Text from '../Text/Text';

/** Detects http(s) and www. URLs in plain text (one match per run). */
const PLAIN_URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

const trimTrailingNonUrlChars = (url: string): string => {
	let u = url.trimEnd();
	while (u.length > 0 && /[),.;:!?]+$/u.test(u)) {
		u = u.slice(0, -1);
	}
	return u;
};

const toOpenableUri = (matched: string): string => {
	const trimmed = trimTrailingNonUrlChars(matched);
	if (/^www\./i.test(trimmed)) {
		return `https://${trimmed}`;
	}
	return trimmed;
};

type Segment =
	| { type: 'text'; value: string }
	| { type: 'link'; value: string };

const splitPlainTextWithUrls = (text: string): Segment[] => {
	const segments: Segment[] = [];
	const lines = text.split('\n');

	lines.forEach((line, lineIndex) => {
		if (lineIndex > 0) {
			segments.push({ type: 'text', value: '\n' });
		}

		let lastIndex = 0;
		const re = new RegExp(PLAIN_URL_REGEX.source, PLAIN_URL_REGEX.flags);
		let match: RegExpExecArray | null = re.exec(line);

		while (match !== null) {
			const raw = match[0];
			const start = match.index;
			if (start > lastIndex) {
				segments.push({
					type: 'text',
					value: line.slice(lastIndex, start),
				});
			}
			segments.push({ type: 'link', value: raw });
			lastIndex = start + raw.length;
			match = re.exec(line);
		}

		if (lastIndex < line.length) {
			segments.push({ type: 'text', value: line.slice(lastIndex) });
		}
	});

	return segments.length > 0 ? segments : [{ type: 'text', value: text }];
};

type TextProps = ComponentProps<typeof Text>;

type LinkifiedTextProps = Omit<TextProps, 'children'> & {
	children: string;
	linkStyle?: StyleProp<TextStyle>;
};

const openLinkInBrowser = (matchedUrl: string) => {
	const uri = toOpenableUri(matchedUrl);
	if (!uri) return;
	void Linking.openURL(uri).catch(err => Say.err(err as ICatchError));
};

/** Renders plain text with tappable URL segments; opens the system browser. */
const LinkifiedText = ({
	children,
	style,
	linkStyle,
	...textProps
}: LinkifiedTextProps) => {
	const segments = splitPlainTextWithUrls(children);

	return (
		<Text {...textProps} style={style}>
			{segments.map((seg, i) =>
				seg.type === 'text' ? (
					<Text key={i}>{seg.value}</Text>
				) : (
					<Text
						key={i}
						style={[styles.textStyle, linkStyle]}
						onPress={() => openLinkInBrowser(seg.value)}
					>
						{seg.value}
					</Text>
				),
			)}
		</Text>
	);
};

const styles = StyleSheet.create({
	textStyle: {
		textDecorationLine: 'underline',
		color: config.colors.brand,
	},
});

export default LinkifiedText;
