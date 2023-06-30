export default function countVotes(type, votesUp, votesDown) {
  if (type === "up") {
    const votes = Math.round((votesUp / (votesDown + votesUp)) * 100);
    return votes;
  } else {
    const votes = Math.round((votesDown / (votesUp + votesDown)) * 100);

    return votes;
  }
}
