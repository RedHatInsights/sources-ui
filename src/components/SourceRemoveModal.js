import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Button, Bullseye, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { loadEntities, removeSource } from '../redux/actions/providers';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const SourceRemoveModal = ({
    history: { push },
    removeSource,
    loadEntities,
    source
}) => {
    const onSubmit = () => removeSource(source.id)
    .then(() => { loadEntities(); push('/'); });

    const onCancel = () => push('/');

    if (!source) {
        return null;
    }

    return (
        <Modal className="ins-c-sources__dialog--warning"
            title=" "
            isOpen
            isSmall
            hideTitle
            onClose={ onCancel }
            actions={ [
                <Button key="cancel" variant="primary" type="button" onClick={ onCancel }>
                    No, do not delete.
                </Button>,
                <Button key="submit" variant="danger" type="button" onClick={ onSubmit }>
                    Yes, delete the data.
                </Button>
            ] }
        >
            <Bullseye>
                <TextContent>
                    <Text component={ TextVariants.h1 }>
                        <span className='ins-c-source__delete-icon' >
                            <ExclamationCircleIcon />
                        </span>
                        Delete { source.name }
                    </Text>
                    <Text component={ TextVariants.p }>
                        Are you sure you want to delete &quot;{ source.name }&quot;? This action cannot be undone.
                    </Text>
                </TextContent>
            </Bullseye>
        </Modal>
    );
};

SourceRemoveModal.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    removeSource: PropTypes.func.isRequired,
    loadEntities: PropTypes.func.isRequired,
    source: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    })
};

const sourceDetailsFromState = (state, id) => {
    return state.providers.entities.find(source => source.id  === id);
};

const mapStateToProps = (state, { match: { params: { id } } }) => ({ source: sourceDetailsFromState(state, id) });

const mapDispatchToProps = (dispatch) => bindActionCreators({
    loadEntities,
    removeSource
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SourceRemoveModal));
