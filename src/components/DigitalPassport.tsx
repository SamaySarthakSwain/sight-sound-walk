import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Map as MapIcon, Star, CheckCircle2, Lock, Landmark, Waves, History, Mic } from "lucide-react";
import { useAchievements, Achievement } from "@/hooks/useAchievements";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
    "Trophy": Trophy,
    "Award": Award,
    "MapIcon": MapIcon,
    "Star": Star,
    "Landmark": Landmark,
    "Waves": Waves,
    "History": History,
    "Mic": Mic,
};

const AchievementBadge = ({ achievement, earnedAt }: { achievement: Achievement; earnedAt?: string }) => {
    const Icon = iconMap[achievement.badge_icon] || Award;
    const isEarned = !!earnedAt;

    return (
        <div className={cn(
            "flex flex-col items-center p-3 rounded-xl border transition-all",
            isEarned
                ? "bg-primary/10 border-primary/30 shadow-sm scale-105"
                : "bg-muted/50 border-border/50 opacity-60 grayscale"
        )}>
            <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                isEarned ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground"
            )}>
                {isEarned ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
            </div>
            <p className="text-xs font-bold text-center mb-1 leading-tight">{achievement.title}</p>
            {isEarned ? (
                <Badge variant="secondary" className="text-[9px] py-0 px-1.5 h-4">
                    Earned
                </Badge>
            ) : (
                <p className="text-[9px] text-muted-foreground text-center">Locked</p>
            )}
        </div>
    );
};

export const DigitalPassport = ({ user, visitCount = 0 }: { user: User, visitCount?: number }) => {
    const { achievements, userAchievements, loading } = useAchievements(user);

    if (loading) return <div>Loading passport...</div>;

    const earnedCount = userAchievements.length;
    const totalCount = achievements.length;
    const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

    return (
        <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                                Digital Travel Passport
                            </CardTitle>
                            <CardDescription>Collect stamps and badges as you explore Odisha</CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-primary">{earnedCount}/{totalCount}</p>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Badges Earned</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1.5 font-medium">
                                <span>Explorer Progress</span>
                                <span>{Math.round(progress)}% Complete</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-muted transition-all" />
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {achievements.map((achievement) => (
                                <AchievementBadge
                                    key={achievement.id}
                                    achievement={achievement}
                                    earnedAt={userAchievements.find(ua => ua.achievement_id === achievement.id)?.earned_at}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Visual Stamps Section */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Destination Stamps
                    </CardTitle>
                    <CardDescription>Visual record of your unique stops</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4 justify-center py-4">
                        <div className="w-20 h-20 rounded-full border-4 border-dashed border-muted-foreground/30 flex items-center justify-center rotate-12 opacity-50">
                            <span className="text-[10px] font-black uppercase text-muted-foreground/40 text-center px-1">More to Explore</span>
                        </div>
                        {Array.from({ length: Math.min(visitCount, 5) }).map((_, i) => (
                            <div key={i} className={cn(
                                "w-20 h-20 rounded-full border-4 border-primary/40 flex flex-col items-center justify-center p-2 text-center bg-primary/5 shadow-inner",
                                i % 2 === 0 ? "-rotate-6" : "rotate-12"
                            )}>
                                <Star className="w-4 h-4 text-primary mb-0.5 fill-primary/20" />
                                <span className="text-[8px] font-black uppercase text-primary/80 leading-none">VERIFIED VISIT</span>
                                <span className="text-[6px] text-muted-foreground mt-1 tracking-widest font-mono">2026-ODSH</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
