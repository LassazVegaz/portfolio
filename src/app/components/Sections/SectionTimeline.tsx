import timelineData, {
  TimelinePiece,
} from "@/app/helpers/timeline-data.helper";
const TimelineItem = ({ data }: { data: TimelinePiece }) => (
  <article className="timeline-item">
    <div className="timeline-meta">
      <span>{data.range}</span>
      <i />
    </div>
    <div className="timeline-card">
      <p className="timeline-company">{data.company}</p>
      <h3>{data.title}</h3>
      <ul>
        {data.points.slice(0, 5).map((point, index) => <li key={index}>{point}</li>)}
      </ul>
    </div>
  </article>
);

const SectionTimeline = () => (
  <section className="experience section-container section-spacing" id="career-timeline">
    <div className="section-label"><span>03</span> Experience</div>
    <div className="section-heading-row">
      <div>
        <p className="eyebrow">The path so far</p>
        <h2>Built through ownership, curiosity, and change.</h2>
      </div>
      <p>From an early startup CTO role to engineering public-sector systems in Singapore.</p>
    </div>
    <div className="timeline">
      {timelineData.map((data, index) => (
        <TimelineItem key={index} data={data} />
      ))}
    </div>
  </section>
);

export default SectionTimeline;
