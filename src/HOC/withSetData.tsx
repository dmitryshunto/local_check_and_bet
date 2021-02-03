import React from 'react';

const withSetData = (OriginalComponent: React.FC, setDataFunction: () => void) => {
    return class extends React.Component {
        componentDidMount() {
            setDataFunction()
        }

        render() {
            return <OriginalComponent {...this.props} />
        }
    }
}

export default withSetData