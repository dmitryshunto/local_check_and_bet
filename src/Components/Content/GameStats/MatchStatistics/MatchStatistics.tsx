import React from 'react';
import classes from './MatchStatistics.module.css';
import common_classes from '../GameStats.module.css'
import styled from 'styled-components';
import { GameKindOfBetDataType } from '../../../../redux/game_stats_reducer'
import { Row, Col } from 'antd';
import { transform_name_for_ui } from '../../../../CommonFunctions/typed_functions';

type PropsType = {
    data: GameKindOfBetDataType
}

const MatchStatistics: React.FC<PropsType> = React.memo(({ data }) => {
    const matchStatisticsRows = Object.keys(data).map(key => {
        let payload = Object.values(data[key]);
        return <MatchStatisticsRow leftblock={payload[0]}
            centerblock={key}
            rightblock={payload[1]}
            key={key} />
    })
    return (
        <div className={classes.match_statistics_table_container}>
            <div className={common_classes.block_header}>
                Match statistic
            </div>
            {matchStatisticsRows}
        </div>
    )
})

type MatchStatisticsRowPropsType = {
    leftblock: number
    centerblock: string
    rightblock: number
}

const MatchStatisticsRow: React.FC<MatchStatisticsRowPropsType> = React.memo(({ leftblock, centerblock, rightblock }) => {
    const styles = { leftblockWidth: 100, rightblockWidth: 100, float: 'right' };
    if (typeof (leftblock) === 'number') {
        if (leftblock < rightblock) {
            styles.leftblockWidth = leftblock / rightblock * 100;
            styles.float = 'right';
            styles.rightblockWidth = 100;
        } else if (rightblock < leftblock) {
            styles.leftblockWidth = 100;
            styles.float = 'left';
            styles.rightblockWidth = rightblock / leftblock * 100;
        }
    }

    const Team1Grafic = styled.div`
        color: #c7c7c7;
        width: ${styles.leftblockWidth}%;
        margin-left: 0.5%;
        margin-right: 0.5%;
        background: #dddddd;
        height: 15px;
        float: ${styles.float};
    `
    const Team2Grafic = styled(Team1Grafic)`
        width: ${styles.rightblockWidth}%;
        background: #8f8f8f
    `
    return (
        <div className={classes.match_statistics_row}>
            <Row>
                <Col span={8}>
                    <div>{leftblock}</div>
                </Col>
                <Col span={8}>
                    <div style = {{textAlign: "center"}}>{transform_name_for_ui(centerblock)}</div>
                </Col>
                <Col span={8}>
                    <div style = {{textAlign: "right"}}>{rightblock}</div>
                </Col>
            </Row>

            <div className={classes.match_statistics_row_grafics}>
                <div className={classes.match_statistics_row_grafics_cell}>
                    <Team1Grafic />
                </div>
                <div className={classes.match_statistics_row_grafics_cell}>
                    <Team2Grafic />
                </div>
            </div>
        </div>
    )
})

export default MatchStatistics;
