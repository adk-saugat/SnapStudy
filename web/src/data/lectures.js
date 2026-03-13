export const lectures = [
  {
    id: "lec-ds-05",
    title: "Data Structures - Trees and Graphs",
    updatedAt: "Updated 2 hours ago",
    files: [
      { name: "lecture-05-board.jpg", type: "Image", size: "2.1 MB" },
      { name: "lecture-05-slides.pdf", type: "PDF", size: "1.4 MB" },
      { name: "voice-note.m4a", type: "Audio", size: "5.2 MB" },
    ],
    chapters: [
      {
        title: "Chapter 1: Binary Trees",
        markdown:
          "## Binary Trees\n- Each node has at most two children.\n- Traversals: preorder, inorder, postorder.\n\n```text\nHeight-balanced trees improve lookup consistency.\n```",
      },
      {
        title: "Chapter 2: Graph Traversal",
        markdown:
          "## BFS vs DFS\nBFS explores level-by-level while DFS goes depth-first.\n\n### Exam Tip\nUse BFS for shortest path in unweighted graphs.",
      },
    ],
  },
  {
    id: "lec-os-07",
    title: "Operating Systems - CPU Scheduling",
    updatedAt: "Updated yesterday",
    files: [
      { name: "os-week7-notes.png", type: "Image", size: "1.9 MB" },
      { name: "scheduling-examples.pdf", type: "PDF", size: "900 KB" },
    ],
    chapters: [
      {
        title: "Chapter 1: Scheduling Goals",
        markdown:
          "## Core Goals\n- Throughput\n- Fairness\n- Response time\n\nSchedulers aim to balance all three under real workloads.",
      },
      {
        title: "Chapter 2: Round Robin",
        markdown:
          "## Round Robin\nTime quantum decides responsiveness.\n\n`Smaller quantum => more context switching`",
      },
    ],
  },
];
