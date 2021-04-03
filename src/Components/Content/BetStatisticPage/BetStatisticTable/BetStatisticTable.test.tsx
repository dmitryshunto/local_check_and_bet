import React from 'react'
import { create } from "react-test-renderer";
import BetStatisticTable, { TablePropsType, BetStatisticTableItem } from './BetStatisticTable';

const props: TablePropsType = {
  data: [
    {
      bet_success: 1,
      book_win1: null,
      book_win2: null,
      book_x: null,
      date_of_match: "2020,-12-12",
      expected_of_home_team: 7.26,
      expected_of_away_team: 3.22,
      expected_result: 4.03,
      expected_total: 10.48,
      home_team_name: "Бристоль",
      away_team_name: "Бристоль Сити",
      home_team_scored: 6,
      away_team_scored: 3,
      total: 9
    },
    {
      bet_success: 1,
      book_win1: null,
      book_win2: null,
      book_x: null,
      date_of_match: "2020,-12-12",
      expected_of_home_team: 7.26,
      expected_of_away_team: 3.22,
      expected_result: 4.03,
      expected_total: 10.48,
      home_team_name: "Ротерхэм",
      away_team_name: "Бристоль Сити",
      home_team_scored: 6,
      away_team_scored: 3,
      total: 9
    }
  ]
}

describe("BetStatisticTable", () => {
  const component = create(<BetStatisticTable {...props} />);
  const test_instance = component.root
  test("Matches number of items", () => {
    expect(test_instance.findAllByType(BetStatisticTableItem).length).toBe(2)
  });
  test("Matches name_of_team", () => {
    expect(test_instance.findAllByType(BetStatisticTableItem)[0].props.data.name_of_team1).toBe("Бристоль")
  })
});