"use client";
import {
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  Timeline,
  TimelineOppositeContent,
} from "@mui/lab";
import { Box, Typography } from "@mui/material";
import timelineData, {
  TimelinePiece,
} from "@/app/helpers/timeline-data.helper";
import styles from "./SectionTimeline.module.scss";

const TimelineItemBla = ({ data }: { data: TimelinePiece }) => (
  <TimelineItem className={styles["timeline-item"]}>
    <TimelineOppositeContent
      color="#000000"
      className={styles["onhover-date-range"]}
      sx={{ opacity: 0.4 }}
    >
      {data.range}
    </TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineDot
        color="primary"
        sx={{ p: 0.8 }}
        className={styles["onhover-glow"]}
      />
      <TimelineConnector className={styles["onhover-glow-ani"]} />
    </TimelineSeparator>
    <TimelineContent
      sx={{ px: 2, pt: 0, pb: 4 }}
      className={styles["onhover-enlarge"]}
    >
      <Typography variant="h5">{data.title}</Typography>
      <Typography variant="h6" mb={1}>
        {data.company}
      </Typography>
      <ul>
        {data.points.map((point, index) => (
          <li key={index}>
            <Typography variant="body1" maxWidth={500}>
              {point}
            </Typography>
          </li>
        ))}
      </ul>
    </TimelineContent>
  </TimelineItem>
);

const SectionTimeline = () => (
  <Box py={5} id="career-timeline" component="section">
    <Typography variant="h4" align="center" mb={5}>
      Career Timeline
    </Typography>
    <Timeline>
      {timelineData.map((data, index) => (
        <TimelineItemBla key={index} data={data} />
      ))}
    </Timeline>
  </Box>
);

export default SectionTimeline;
