import * as PropTypes from 'prop-types';
import * as React from 'react';

const DURATION = 500;
const EDGE_OFFSET = 30; // TODO

export default function ScrollContainer() {
    return Component => {
        const componentName = Component.displayName || Component.name || 'Unknown';

        class ScrollContainer extends React.Component {
            static childContextTypes = {
                scroller: PropTypes.any
            };

            static displayName = `ScrollContainer(${componentName})`;

            constructor(props) {
                super(props);
            }

            getChildContext() {
                return {
                    scroller: this.getScroller()
                };
            }

            render() {
                return <Component {...this.props}>{this.props.children}</Component>;
            }

            getScroller() {
                const container = document.getElementById(this.props.id);
                if (!container) {
                    return null;
                }

                return zenscroll.createScroller(container, DURATION, EDGE_OFFSET);
            }
        }

        return ScrollContainer;
    };
}
