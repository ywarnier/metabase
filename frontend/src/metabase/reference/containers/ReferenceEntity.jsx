/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";

import S from "metabase/reference/Reference.css";

import List from "metabase/components/List.jsx";
import Detail from "metabase/components/Detail.jsx";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper.jsx";

import ReferenceHeader from "metabase/reference/components/ReferenceHeader.jsx";
import FieldTypeDetail from "metabase/reference/components/FieldTypeDetail.jsx";
import UsefulQuestions from "metabase/reference/components/UsefulQuestions.jsx";
import FieldsToGroupBy from "metabase/reference/components/FieldsToGroupBy.jsx";
import RevisionMessageModal from "metabase/reference/components/RevisionMessageModal.jsx";
import Formula from "metabase/reference/components/Formula.jsx";

import cx from "classnames";

import {
    tryUpdateData
} from '../utils';

import {
    getSection,
    getData,
    getTableByMetric,
    getTableBySegment,
    getError,
    getLoading,
    getUser,
    getHasQuestions,
    getIsEditing,
    getHasDisplayName,
    getHasRevisionHistory,
    getHasSingleSchema,
    getIsFormulaExpanded,
    getForeignKeys
} from "../selectors";

import * as metadataActions from 'metabase/redux/metadata';
import * as actions from 'metabase/reference/reference';

const mapStateToProps = (state, props) => {
    const section = getSection(state);
    // a bit hacky
    // will have to do until we refactor to use 1 container per section type
    const table = section.type === 'metric' ?
        getTableByMetric(state) :
        section.type === 'segment' ?
            getTableBySegment(state) :
            {};

    return {
        section,
        entity: getData(state) || {},
        table,
        loading: getLoading(state),
        // naming this 'error' will conflict with redux form
        loadingError: getError(state),
        user: getUser(state),
        foreignKeys: getForeignKeys(state),
        isEditing: getIsEditing(state),
        hasSingleSchema: getHasSingleSchema(state),
        hasQuestions: getHasQuestions(state),
        hasDisplayName: getHasDisplayName(state),
        isFormulaExpanded: getIsFormulaExpanded(state),
        hasRevisionHistory: getHasRevisionHistory(state)
    };
};

const mapDispatchToProps = {
    ...metadataActions,
    ...actions
};

const validate = (values, props) => props.hasRevisionHistory ?
    !values.revision_message ?
        { revision_message: "Please enter a revision message" } : {} :
    {};

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({
    form: 'details',
    fields: ['name', 'display_name', 'description', 'revision_message', 'points_of_interest', 'caveats', 'how_is_this_calculated', 'special_type', 'fk_target_field_id'],
    validate
})
export default class ReferenceEntity extends Component {
    static propTypes = {
        style: PropTypes.object.isRequired,
        entity: PropTypes.object.isRequired,
        table: PropTypes.object,
        user: PropTypes.object.isRequired,
        foreignKeys: PropTypes.object,
        isEditing: PropTypes.bool,
        hasQuestions: PropTypes.bool,
        startEditing: PropTypes.func.isRequired,
        endEditing: PropTypes.func.isRequired,
        startLoading: PropTypes.func.isRequired,
        endLoading: PropTypes.func.isRequired,
        expandFormula: PropTypes.func.isRequired,
        collapseFormula: PropTypes.func.isRequired,
        setError: PropTypes.func.isRequired,
        updateField: PropTypes.func.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        fields: PropTypes.object.isRequired,
        section: PropTypes.object.isRequired,
        hasSingleSchema: PropTypes.bool,
        hasDisplayName: PropTypes.bool,
        isFormulaExpanded: PropTypes.bool,
        hasRevisionHistory: PropTypes.bool,
        loading: PropTypes.bool,
        loadingError: PropTypes.object,
        submitting: PropTypes.bool,
        onChangeLocation: PropTypes.func
    };

    render() {
        const {
            fields: { name, display_name, description, revision_message, points_of_interest, caveats, how_is_this_calculated, special_type, fk_target_field_id },
            style,
            section,
            entity,
            table,
            loadingError,
            loading,
            user,
            foreignKeys,
            isEditing,
            hasQuestions,
            startEditing,
            endEditing,
            expandFormula,
            collapseFormula,
            hasSingleSchema,
            hasDisplayName,
            isFormulaExpanded,
            hasRevisionHistory,
            handleSubmit,
            submitting,
            onChangeLocation
        } = this.props;

        const onSubmit = handleSubmit(async (fields) =>
            await tryUpdateData(fields, this.props)
        );

        return (
            <form style={style} className="full"
                onSubmit={onSubmit}
            >
                { isEditing &&
                    <div className={cx("EditHeader wrapper py1", S.editHeader)}>
                        <div>
                            You are editing this page
                        </div>
                        <div className={S.editHeaderButtons}>
                            { hasRevisionHistory ?
                                <RevisionMessageModal
                                    action={() => onSubmit()}
                                    field={revision_message}
                                    submitting={submitting}
                                >
                                    <button
                                        className={cx("Button", "Button--primary", "Button--white", "Button--small", S.saveButton)}
                                        type="button"
                                        disabled={submitting}
                                    >
                                        SAVE
                                    </button>
                                </RevisionMessageModal> :
                                <button
                                    className={cx("Button", "Button--primary", "Button--white", "Button--small", S.saveButton)}
                                    type="submit"
                                    disabled={submitting}
                                >
                                    SAVE
                                </button>
                            }

                            <button
                                type="button"
                                className={cx("Button", "Button--white", "Button--small", S.cancelButton)}
                                onClick={endEditing}
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                }
                <ReferenceHeader
                    entity={entity}
                    table={table}
                    section={section}
                    user={user}
                    isEditing={isEditing}
                    hasSingleSchema={hasSingleSchema}
                    hasDisplayName={hasDisplayName}
                    startEditing={startEditing}
                    displayNameFormField={display_name}
                    nameFormField={name}
                />
                <LoadingAndErrorWrapper loading={!loadingError && loading} error={loadingError}>
                { () =>
                    <div className="wrapper wrapper--trim">
                        <List>
                            <li className="relative">
                                <Detail
                                    id="description"
                                    name="Description"
                                    description={entity.description}
                                    placeholder="No description yet"
                                    isEditing={isEditing}
                                    field={description}
                                />
                            </li>
                            { hasDisplayName && !isEditing &&
                                <li className="relative">
                                    <Detail
                                        id="name"
                                        name="Actual name in database"
                                        description={entity.name}
                                        subtitleClass={S.tableActualName}
                                    />
                                </li>
                            }
                            <li className="relative">
                                <Detail
                                    id="points_of_interest"
                                    name={`Why this ${section.type} is interesting`}
                                    description={entity.points_of_interest}
                                    placeholder="Nothing interesting yet"
                                    isEditing={isEditing}
                                    field={points_of_interest}
                                    />
                            </li>
                            <li className="relative">
                                <Detail
                                    id="caveats"
                                    name={`Things to be aware of about this ${section.type}`}
                                    description={entity.caveats}
                                    placeholder="Nothing to be aware of yet"
                                    isEditing={isEditing}
                                    field={caveats}
                                />
                            </li>
                            { section.type === 'metric' &&
                                <li className="relative">
                                    <Detail
                                        id="how_is_this_calculated"
                                        name={`How this ${section.type} is calculated`}
                                        description={entity.how_is_this_calculated}
                                        placeholder="Nothing on how it's calculated yet"
                                        isEditing={isEditing}
                                        field={how_is_this_calculated}
                                    />
                                </li>
                            }
                            { (section.type === 'metric' || section.type === 'segment') &&
                                table &&
                                <li className="relative">
                                    <Formula
                                        type={section.type}
                                        entity={entity}
                                        table={table}
                                        isExpanded={isFormulaExpanded}
                                        expandFormula={expandFormula}
                                        collapseFormula={collapseFormula}
                                    />
                                </li>
                            }
                            { !isEditing && section.type === 'field' &&
                                <li className="relative">
                                    <Detail
                                        id="base_type"
                                        name={`Data type`}
                                        description={entity.base_type}
                                    />
                                </li>
                            }
                            { section.type === 'field' &&
                                <li className="relative">
                                    <FieldTypeDetail
                                        field={entity}
                                        foreignKeys={foreignKeys}
                                        fieldTypeFormField={special_type}
                                        foreignKeyFormField={fk_target_field_id}
                                        isEditing={isEditing}
                                    />
                                </li>
                            }
                            { hasQuestions && !isEditing &&
                                <li className="relative">
                                    <UsefulQuestions questions={section.questions} />
                                </li>
                            }
                            { section.type === 'metric' && !isEditing &&
                                <li className="relative">
                                    <FieldsToGroupBy
                                        table={table}
                                        metric={entity}
                                        title={"Fields you can group this metric by"}
                                        onChangeLocation={onChangeLocation}
                                    />
                                </li>
                            }
                        </List>
                    </div>
                }
                </LoadingAndErrorWrapper>
            </form>
        )
    }
}
