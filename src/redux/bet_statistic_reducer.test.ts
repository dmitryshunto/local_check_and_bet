import betStatisticReducer, { actions, FullBetStatisticDataType, FullBetStatisticItemType } from "./bet_statistic_reducer";

let innitialObject = {
    isGettingData: true,
    data: null as FullBetStatisticDataType
};

let data: FullBetStatisticDataType = [
    {
        bet_success: false,
        expected_of_team1: 2,
        expected_of_team2: 6,
        expected_result: 1,
        expected_total: 8,
        name_of_team1: 'name_of_team1',
        name_of_team2: 'name_of_team2',
        team1_scored: 3,
        team2_scored: 7,
        total: 10,
        date_of_match: '2021-02-26',
    }
];

it('toggling_is_getting_data', () => {
    let action = actions.toggle_is_getting_data(true);
    let newState = betStatisticReducer(innitialObject, action);
    expect(newState.isGettingData).toBe(true);
});

it('setting_bet_statistic', () => {   
    let action = actions.set_bet_statistic({data, isGettingData: false});
    let newState = betStatisticReducer(innitialObject, action);
    expect(newState.data![0]['date_of_match']).toBe('2021-02-26'); 
});
