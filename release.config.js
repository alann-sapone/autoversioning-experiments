import createPreset from "conventional-changelog-angular";

const TICKET_BASE_URL = "https://www.notion.so";
const API_KEY = "ntn_m9177412801adUyG68OlyP0xRSxtbvFGeHDYfITvhnH6Ys";

const REFS_Keyword = "Refs";

const angularPreset = await createPreset();
const noteKeywords = [REFS_Keyword, ...angularPreset.parser.noteKeywords];

const getTicketName = async (ticketId) => {
  try {
    const pageMetadata = await (
      await fetch(`https://api.notion.com/v1/blocks/${ticketId}`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
      })
    ).json();
    return pageMetadata.child_page.title;
  } catch (error) {
    return ticketId;
  }
};

export default {
  branches: [
    // Cas 1 : main → Release Candidate (pré-versions)
    {
      "name": "main",
      "prerelease": "rc"
    },

    // Cas 2 : branches de freeze → Release stable
    {
      "name": "release/*"
    }
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    [
      "@semantic-release/release-notes-generator", 
      {
        parserOpts: {
          ...angularPreset.parser,
          noteKeywords,
        },
        writerOpts: {
          ...angularPreset.writer,
          transform: async (commit, context) => {
            const transformed = angularPreset.writer.transform(commit, context);

            // Manually handle tickets entries in a separated group
            if (commit?.notes?.length) {
              transformed.notes = await Promise.all(
                commit.notes.map(async (note) => {
                  const ticketId =
                    note.text.charAt(0) === "#"
                      ? note.text.slice(1)
                      : note.text;
                  return note.title === REFS_Keyword
                    ? {
                        title: "Related Tickets",
                        text: `[${await getTicketName(
                          ticketId
                        )}](${TICKET_BASE_URL}/${ticketId})`,
                      }
                    : note;
                })
              );
            }

            return transformed;
          },
        },
      },
    ],
    "@semantic-release/github"
  ],
};
