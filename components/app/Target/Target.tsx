import GanttChart from "./Gantt";

type Props = {
    targetId: string
};

export default function Target(props: Props) {
    return (
        <div>
            <GanttChart targetId={props.targetId}/>
        </div>
    )
}