import { Row } from '@/components/atoms';
import { config } from '@/theme/_config';
import { PropsWithChildren } from 'react';

const HeaderButtonGroup = ({ children }: PropsWithChildren) => (
	<Row style={[{ marginRight: config.metrics.rg }]}>{children}</Row>
);

export default HeaderButtonGroup;
