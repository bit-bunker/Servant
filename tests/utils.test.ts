import { memberIdsFromString } from "../src/utils/members"

const VALID_TEST_DATA =
    "<@1087390351792279593> <@314858301726785546> <@255114170008076292>"
const INVALID_TEST_DATA = "Where is my dad?";

describe('Members utils', () => {
    test("assert valid data", () => {
        expect(memberIdsFromString(VALID_TEST_DATA)).toStrictEqual(['1087390351792279593', '314858301726785546', '255114170008076292']);
    })

    test('assert invalid data', () => {
        expect(memberIdsFromString(INVALID_TEST_DATA)).toStrictEqual([])
    })
})