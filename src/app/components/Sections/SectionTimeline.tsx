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
import { Typography } from "@mui/material";
import timelineData from "@/app/helpers/timeline-data.helper";

const SectionTimeline = () => {
  return (
    <Timeline>
      {timelineData.map((data, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent>{data.range}</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ px: 2, py: 0 }}>
            <Typography variant="h5">{data.title}</Typography>
            <Typography variant="h6">{data.company}</Typography>
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
      ))}
    </Timeline>
  );
};

export default SectionTimeline;
