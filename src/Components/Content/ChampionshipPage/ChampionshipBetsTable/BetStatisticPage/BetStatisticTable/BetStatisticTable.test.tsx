import React from 'react'
import { create } from "react-test-renderer";
import BetStatisticTable, { TablePropsType, BetStatisticTableItem } from './BetStatisticTable';

const props: TablePropsType = {
  data: [
    {
      bet_success: true,
      book_win1: null,
      book_win2: null,
      book_x: null,
      date_of_match: "2020,-12-12",
      expected_of_team1: 7.26,
      expected_of_team2: 3.22,
      expected_result: 4.03,
      expected_total: 10.48,
      name_of_team1: "Бристоль",
      name_of_team2: "Бристоль Сити",
      team1_scored: 6,
      team2_scored: 3,
      total: 9
    },
    {
      bet_success: true,
      book_win1: null,
      book_win2: null,
      book_x: null,
      date_of_match: "2020,-12-12",
      expected_of_team1: 7.26,
      expected_of_team2: 3.22,
      expected_result: 4.03,
      expected_total: 10.48,
      name_of_team1: "Ротерхэм",
      name_of_team2: "Бристоль Сити",
      team1_scored: 6,
      team2_scored: 3,
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