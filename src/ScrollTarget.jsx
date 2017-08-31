import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import hoistNonReactStatics from 'hoist-non-react-statics';

const duration = 500;

export default function ScrollTarget() {
    return Component => {
        const componentName = Component.displayName || Component.name || 'Unknown';

        class ScrollTarget extends React.Component {
            static contextTypes = {
                scroller: PropTypes.any,
                registerMountCallback: PropTypes.func
            };

            static displayName = `ScrollTarget(${componentName})`;

            callbacks = [];

            constructor(props) {
                super(props);
                this.state = {
                    isMounted: false
                };

                this.assignRef = this.assignRef.bind(this);
                this.scrollIntoView = this.scrollIntoView.bind(this);
            }

            componentDidUpdate() {
                const { scroller } = this.context;
                if (scroller && this.callbacks.length > 0) {
                    this.callbacks.forEach(cb => cb());
                    this.callbacks = [];
                }
            }

            render() {
                return <Component {...this.props} scrollIntoView={this.scrollIntoView} ref={this.assignRef} />;
            }

            assignRef(el) {
                this.child = el;
            }

            scrollIntoView() {
                const { scroller } = this.context;
                const child = ReactDOM.findDOMNode(this.child);

                if (!scroller || !scroller.intoView) {
                    this.callbacks.push(this.scrollIntoView.bind(this));
                    return new Promise((resolve, reject) => {
                        this.callbacks.push(resolve);
                    });
                }

                if (!child) {
                    return Promise.reject('Could not find element to scroll to');
                }

                return new Promise((resolve, reject) => {
                    scroller.intoView(child, duration, resolve);
                });
            }
        }

        return hoistNonReactStatics(ScrollTarget, Component);
    };
}
