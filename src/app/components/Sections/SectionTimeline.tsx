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
      <h5 className="text-2xl">{data.title}</h5>
      <h6 className="text-xl mb-5">{data.company}</h6>
      <ul>
        {data.points.map((point, index) => (
          <li key={index}>
            <p className="max-w-[500px] text-base">{point}</p>
          </li>
        ))}
      </ul>
    </TimelineContent>
  </TimelineItem>
);

const SectionTimeline = () => (
  <section className="py-5" id="career-timeline">
    <h4 className="text-4xl text-center mb-8">Career Timeline</h4>
    <Timeline>
      {timelineData.map((data, index) => (
        <TimelineItemBla key={index} data={data} />
      ))}
    </Timeline>
  </section>
);

export default SectionTimeline;
