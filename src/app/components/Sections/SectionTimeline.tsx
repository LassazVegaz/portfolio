import timelineData, {
  TimelinePiece,
} from "@/app/helpers/timeline-data.helper";
import styles from "./SectionTimeline.module.scss";

const TimelineItem = ({ data }: { data: TimelinePiece }) => (
  <div
    className={`${styles["timeline-item"]} grid grid-cols-[auto_auto_1fr] gap-4 w-[700px]`}
  >
    <div
      className={`text-sm lg:text-base text-center md:text-right ${styles["onhover-date-range"]} opacity-40 pt-1`}
    >
      {data.range}
    </div>
    <div className="grid grid-rows-[auto_1fr] gap-2 justify-items-center pt-3">
      <span
        color="primary"
        className={`${styles["onhover-glow"]} w-4 h-4 inline-block bg-blue-600 rounded-full`}
      />
      <span
        className={`${styles["onhover-glow-ani"]}  w-0.5 inline-block bg-white opacity-70 rounded`}
      />
    </div>
    <div className={`${styles["onhover-enlarge"]} pb-5`}>
      <h5 className="text-2xl dark:text-slate-50">{data.title}</h5>
      <h6 className="text-xl mb-5 dark:text-slate-100">{data.company}</h6>
      <ul className="dark:text-slate-300">
        {data.points.map((point, index) => (
          <li key={index}>
            <p className="max-w-[500px] text-base">{point}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const SectionTimeline = () => (
  <section className="py-5 mt-28" id="career-timeline">
    <h4 className="text-4xl text-center mb-8">Career Timeline</h4>
    <div className="flex flex-col items-center gap-1">
      {timelineData.map((data, index) => (
        <TimelineItem key={index} data={data} />
      ))}
    </div>
  </section>
);

export default SectionTimeline;
