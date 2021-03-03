import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { create } from "react-test-renderer";
import Game from '../../../CommonComponents/Game/Game';
import Championship, { ChampionshipPropsType } from './Championship';

const props: ChampionshipPropsType = {
  bets: [],
  championship: {
    "name_of_championship": "англия чемпион-лига",
    "games": [{
      "name_of_team1": "Дерби Каунти", "name_of_team2": "Ноттингем Форест", "games_id": 401,
      "goals": {
        "odd_blocks": [{ "odd": 2.63, "odd_type": "W1" }, { "odd": 3.05, "odd_type": "X" }, { "odd": 3.02, "odd_type": "W2" }],
        "team1_scored": null, "team2_scored": null, "book_win1": 2.63, "book_x": 3.05, "book_win2": 3.02, "expected_of_home_team2": 0.71,
        "expected_of_away_team2": 0.83, "expected_result2": -0.12, "expected_total2": 1.55, "expected_win1": 40, "expected_x": 23.33,
        "expected_win2": 36.67, "expected_over": 30, "selection_over": false, "expected_under": 70, "selection_under": false
      },
      "ycard": {
        "odd_blocks": [{ "odd": null, "odd_type": "W1" }, { "odd": null, "odd_type": "X" }, { "odd": null, "odd_type": "W2" }],
        "team1_scored": null, "team2_scored": null, "book_win1": null, "book_x": null, "book_win2": null,
        "expected_of_home_team2": 1.66, "expected_of_away_team2": 1.4, "expected_result2": 0.25, "expected_total2": 3.06,
        "expected_win1": 46.67, "expected_x": 13.33, "expected_win2": 40, "expected_over": 48, "selection_over": false, "expected_under": 52, "selection_under": false
      },
      "corners": {
        "odd_blocks": [{ "odd": null, "odd_type": "W1" }, { "odd": null, "odd_type": "X" }, { "odd": null, "odd_type": "W2" }], "team1_scored": null,
        "team2_scored": null, "book_win1": null, "book_x": null, "book_win2": null, "expected_of_home_team2": 4.74, "expected_of_away_team2": 3.69,
        "expected_result2": 1.05, "expected_total2": 8.44, "expected_win1": 56.67, "expected_x": 10, "expected_win2": 33.33, "expected_over": 40,
        "selection_over": false, "expected_under": 60, "selection_under": false
      }
    }], "basic_totals": { "goals": 2, "ycard": 3, "corners": 9.5 },
    "checked": false
  },
  addBet: () => { },
  removeBet: () => { },
  date_of_prediction: '2021-02-26',
  changeChampionshipCheckedStatus: (name_of_championship: string, date_of_prediction: string) => { }
}

const Champ = (props: ChampionshipPropsType) => {
  return (
    <BrowserRouter>
      <Championship {...props} />
    </BrowserRouter>
  )
};

describe("MainPageChampionshipTable", () => {
  const component = create(<Champ {...props} />);
  const instance = component.root;
  // test("Championship table must be hidden with true checked props", () => {
  //   expect(instance.findAllByType('table').length).toBe(0);
  // });
  test("Championship table must be displayed with false checked props", () => {
    expect(instance.findAllByType('table').length).toBe(1);
  });
});