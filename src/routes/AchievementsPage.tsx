import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Gallery,
  Icon,
  PageSection
} from "@patternfly/react-core";
import {PageHeader} from "../components/PageHeader.tsx";
import {Achievements} from "../utils/achievements.tsx";
import {useObtainedAchievements} from "../hooks/useObtainedAchievements.ts";
import {CheckCircleIcon} from "@patternfly/react-icons";

export function AchievementsPage() {
  const obtainedAchievements = useObtainedAchievements();

  return (
    <>
      <PageHeader title="Achievements" />
      <PageSection>
        <Gallery hasGutter maxWidths={{ default: "256px" }}>
          {Object.entries(Achievements).map(([id, a]) => {
            const obtainedAchievement = obtainedAchievements.data?.find((achievement) => achievement.achievementId === id);

            return (
              <Card>
                <CardHeader>
                  <img src={a.iconPath} alt={a.name} />
                </CardHeader>
                <CardTitle subtitle={a.quote}>{a.name}</CardTitle>
                <CardBody>
                  {a.description}
                </CardBody>
                <CardFooter>
                  {!obtainedAchievements.loading && obtainedAchievement && (
                    <>
                      <Icon status="success" isInline>
                        <CheckCircleIcon />
                      </Icon>
                      {" "}
                      <span>Obtained at {obtainedAchievement.obtainedAt.toDateString()}</span>
                    </>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </Gallery>
      </PageSection>
    </>
  );
}